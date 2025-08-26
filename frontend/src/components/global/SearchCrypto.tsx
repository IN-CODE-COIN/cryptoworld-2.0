import { useState, useRef, useEffect } from "react";
import { Modal, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

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
  const inputRef = useRef<InputRef>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

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
      title="Buscar Criptomoneda"
      open={searchModalVisible}
      onCancel={() => setSearchModalVisible(false)}
      footer={null}
      centered
    >
      <div className="relative">
        <Input.Search
          ref={inputRef}
          placeholder="Introduce el nombre o símbolo de la criptomoneda"
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
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <ul className="py-1 overflow-auto text-gray-700 dark:text-gray-200 max-h-60">
              {suggestions.map((coin) => (
                <li
                  key={coin.uuid}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 dark:hover:bg-gray-700"
                  onClick={() => handleSuggestionClick(coin)}
                >
                  <img
                    src={coin.iconUrl}
                    alt={coin.name}
                    className="w-5 h-5 object-contain"
                  />
                  <span>
                    {coin.name} (
                    <span className="text-gray-500 dark:text-gray-400">
                      {coin.symbol}
                    </span>
                    )
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};
