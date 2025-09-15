import React, { useEffect, useState } from "react";
import { Table, Spin, Empty, Tag, Button } from "antd";
import type { TableColumnsType } from "antd";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

interface Movement {
  id: number;
  type: "deposito" | "retirada";
  amount: number;
  description?: string;
  date: string;
}

interface Position {
  symbol: string;
  amount: number;
  quantity: number;
  average_price: number;
  current_price: number;
  profit: number;
  total_change: number;
  totalValue: number;
}

interface WalletData {
  balance: number;
  movements: Movement[];
  positions: Position[];
  totalValue: number;
  totalProfit: number;
  totalChange: number;
}

export const Wallet: React.FC = () => {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.rol === "pro") {
      api
        .get("/cartera")
        .then((res) => setData(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading)
    return <Spin fullscreen={true} tip="Cargando cartera..." size="large" />;

  if (user?.rol === "normal") {
    return (
      <div className="py-10 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">
          Esta funcionalidad solo esta disponible para el plan profesional
        </h2>
        <p className="text-gray-600 mb-6">
          Mejora tu plan para acceder a la gestión de movimientos y posiciones.
        </p>
        <Button type="primary" onClick={() => navigate("/pricing")}>
          Mejorar plan
        </Button>
      </div>
    );
  }
  if (!data) return <Empty description="No se pudo cargar la cartera." />;

  //* Columnas movimientos **/
  const movementColumns: TableColumnsType<Movement> = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (type: Movement["type"]) =>
        type === "deposito" ? (
          <Tag color="green">Depósito</Tag>
        ) : (
          <Tag color="red">Retirada</Tag>
        ),
    },
    {
      title: "Cantidad",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record) => (
        <span
          className={
            record.type === "deposito" ? "text-green-600" : "text-red-600"
          }
        >
          ${amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      render: (desc?: string) => desc || "-",
    },
  ];

  //* Columnas posiciones **/
  const positionColumns: TableColumnsType<Position> = [
    { title: "Cripto", dataIndex: "symbol", key: "symbol" },
    {
      title: "Invertido",
      dataIndex: "quantity",
      key: "quantity",
      render: (q: unknown) => `$${Number(q ?? 0).toFixed(2)}`,
    },
    {
      title: "Unidades",
      dataIndex: "amount",
      key: "amount",
      render: (a: unknown) => Number(a ?? 0).toFixed(6),
    },
    {
      title: "Precio Medio",
      dataIndex: "average_price",
      key: "average_price",
      render: (p: unknown) => `$${Number(p ?? 0).toFixed(2)}`,
    },
    {
      title: "Valor",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (val: unknown, record) => {
        const numVal = typeof val === "number" ? val : 0; // valor por defecto si no es número
        return (
          <span
            className={
              numVal >= record.quantity ? "text-green-600" : "text-red-600"
            }
          >
            ${numVal.toFixed(3)}
          </span>
        );
      },
    },
    {
      title: "P/G",
      dataIndex: "profit",
      key: "profit",
      render: (profit: number | unknown) => {
        const numProfit = typeof profit === "number" ? profit : 0;
        return (
          <span className={numProfit >= 0 ? "text-green-600" : "text-red-600"}>
            ${numProfit.toFixed(3)}
          </span>
        );
      },
    },
    {
      title: "%",
      dataIndex: "total_change",
      key: "total_change",
      render: (change: number | unknown) => {
        const numChange = typeof change === "number" ? change : 0;
        return (
          <span className={numChange >= 0 ? "text-green-600" : "text-red-600"}>
            {numChange.toFixed(3)}%
          </span>
        );
      },
    },
  ];

  return (
    <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Saldo */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 text-center">
        <h3 className="text-lg font-semibold">Efectivo</h3>
        <p className="text-3xl font-bold text-green-500 mt-2">
          $
          {data.balance.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          })}
        </p>
        <Link
          title="Ingresar / Retirar"
          to="/cartera/create"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-xs font-medium"
        >
          Ingresar / Retirar
        </Link>
      </div>

      {/* Nueva transacción */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Nueva transacción
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 p-2">
          Registra una compra o venta de criptomonedas.
        </p>
        <Link
          title="Añadir Transacción"
          to="transaction/create"
          className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-xs font-medium"
        >
          Añadir Transacción
        </Link>
      </div>

      {/* Últimos movimientos */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 col-span-1 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold mb-2">Últimos 5 movimientos</h3>
          <Link
            title="Ver todos los movimientos"
            to="/cartera/moves"
            className="text-sm text-blue-600 hover:underline mb-2"
          >
            Ver todos
          </Link>
        </div>
        <Table
          columns={movementColumns}
          dataSource={data.movements}
          rowKey="id"
          pagination={false}
          size="small"
          locale={{ emptyText: <Empty description="No hay movimientos." /> }}
          scroll={{ x: "max-content" }}
        />
      </div>
      {/* Posiciones */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 col-span-1 md:col-span-2">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Posiciones activas</h3>
          <div className="text-right">
            <div>
              Perdidas /Ganancias:{" "}
              <span
                className={
                  data.totalProfit >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                ${data.totalProfit.toFixed(2)}
              </span>
            </div>
            <div
              className={
                data.totalChange >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {data.totalChange.toFixed(2)}%
            </div>
          </div>
        </div>
        <Table
          columns={positionColumns}
          dataSource={data.positions}
          rowKey="symbol"
          pagination={false}
          size="small"
          locale={{
            emptyText: <Empty description="No hay posiciones activas." />,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};
