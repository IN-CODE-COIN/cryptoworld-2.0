import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Empty, Button, Table, Modal, message, Avatar, Tag } from "antd";
import type { Breakpoint, TableColumnsType } from "antd";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";

import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/axios";

type Coin = {
  id: number;
  name: string;
  symbol: string;
  icon_url?: string;
  price: number;
  change: number;
  market_cap: number;
};

const formatMarketCap = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

export const ListIndex = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

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

  const columns: TableColumnsType<Coin> = [
    {
      title: "#",
      key: "index",
      render: (_: unknown, __: Coin, index: number) => (
        <span className="text-gray-500">{index + 1}</span>
      ),
      responsive: ["md"] as Breakpoint[],
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Coin) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.icon_url} alt={name} size="small" />
          <div className="flex items-center gap-0.5 sm:gap-2">
            <span className="font-medium">{name}</span>
            <Tag className="ml-1 sm:ml-2">{record.symbol}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (price: number) =>
        `$${price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "24h %",
      dataIndex: "change",
      key: "change",
      render: (change: number) => (
        <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
          {change.toFixed(2)}%
        </span>
      ),
    },
    {
      title: "Cap. Mercado",
      dataIndex: "market_cap",
      key: "market_cap",
      render: formatMarketCap,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: Coin) => (
        <Button
          title="Eliminar"
          type="text"
          danger
          icon={<DeleteOutlined />}
          loading={isDeleting === record.id}
          onClick={() => showDeleteConfirm(record)}
        />
      ),
    },
  ];

  return (
    <Spin
      spinning={loading}
      tip="Cargando lista de seguimiento..."
      size="large"
    >
      <Button
        title="Mejora tu plan"
        style={{ display: user?.rol === "normal" ? "block" : "none" }}
        className="mb-2"
        type="link"
        size="small"
        onClick={() => navigate("/pricing")}
      >
        Añadir más criptomonedas a la lista
      </Button>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <Table
          columns={columns}
          dataSource={coins}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <Empty description="No tienes criptomonedas en tu lista de seguimiento todavía." />
            ),
          }}
        />
      </div>
    </Spin>
  );
};
