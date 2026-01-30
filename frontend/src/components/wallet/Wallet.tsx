import React, { useEffect, useState } from "react";
import { Table, Spin, Empty, Tag, Button } from "antd";
import type { TableColumnsType } from "antd";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import {
  CheckOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

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
  const { theme } = useTheme();

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
    const features = [
      "Seguimiento en tiempo real de tu cartera",
      "Gestión de depósitos y retiradas",
      "Historial completo de transacciones",
      "Análisis detallado de ganancias/pérdidas",
      "Múltiples posiciones activas",
      "Reportes personalizados",
    ];

    return (
      <div
        className={`rounded-2xl border-2 border-dashed p-8 md:p-12 text-center ${
          theme === "dark"
            ? "bg-linear-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50"
            : "bg-linear-to-br from-blue-50 to-purple-50 border-blue-300"
        }`}
      >
        <div className="max-w-2xl mx-auto">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <LockOutlined className="text-4xl text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-3">
            Desbloquea tu cartera
          </h2>

          <p
            className={`text-lg mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            Accede a herramientas profesionales para gestionar y analizar tus
            inversiones en criptomonedas
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckOutlined className="text-green-500 text-lg shrink-0 mt-1" />
                <span
                  className={
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/pricing")}
            className="bg-linear-to-r from-blue-600 to-purple-600 border-none h-12 px-8 text-base font-semibold hover:shadow-lg hover:shadow-blue-500/50"
          >
            Mejorar a Plan Pro
          </Button>

          <p
            className={`text-sm mt-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Consulta nuestros planes y elige el que mejor se adapte a tus
            necesidades
          </p>
        </div>
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
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Saldo */}
        <Link
          to="/cartera/create"
          className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Efectivo Disponible
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            $
            {data.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
          <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Ingresar o retirar
            </span>
            <ArrowRightOutlined
              className={`text-base transition-colors ${
                theme === "dark"
                  ? "text-gray-500 group-hover:text-gray-300"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
          </div>
        </Link>

        {/* Nueva transacción */}
        <Link
          to="transaction/create"
          className={`group rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Registrar Movimiento
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nueva transacción
          </h3>
          <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Registrar compra/venta
            </span>
            <ArrowRightOutlined
              className={`text-base transition-colors ${
                theme === "dark"
                  ? "text-gray-500 group-hover:text-gray-300"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
          </div>
        </Link>
      </div>

      {/* Últimos movimientos */}
      <div
        className={`rounded-xl border p-6 ${
          theme === "dark"
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Últimos 5 movimientos</h3>
          <Link
            title="Ver todos los movimientos"
            to="/cartera/moves"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver todos →
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
      <div
        className={`rounded-xl border p-6 ${
          theme === "dark"
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Posiciones activas</h3>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              Tu portafolio de criptomonedas
            </p>
          </div>
          <div className="text-right">
            <div className="mb-1">
              <p
                className={`text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                P/G Total
              </p>
              <p
                className={`text-lg font-bold ${
                  data.totalProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${data.totalProfit.toFixed(2)}
              </p>
            </div>
            <div>
              <p
                className={`text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                Cambio
              </p>
              <p
                className={`text-lg font-bold ${
                  data.totalChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {data.totalChange.toFixed(2)}%
              </p>
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
