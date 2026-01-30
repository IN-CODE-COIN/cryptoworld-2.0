import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import dayjs from "dayjs";

export const BillingPlan: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  let plan = "Gratuito";
  let frequency = "Ilimitado";
  let amount = 0;
  let nextPayment: string | Date = "No hay renovación";
  let amountTime;

  if (user) {
    if (user.trial_ends_at && dayjs().isBefore(dayjs(user.trial_ends_at))) {
      plan = "Trial";
      frequency = "Prueba gratuita";
      amount = 0;
      nextPayment = `Finaliza el ${dayjs(user.trial_ends_at).format(
        "DD/MM/YYYY",
      )}`;
    } else if (user.rol === "pro") {
      plan = "Profesional";
      frequency = user.frequency ?? "mensual";
      amount = frequency === "anual" ? 490 : 50;
      amountTime = frequency === "anual" ? "€/año" : "€/mes";
      nextPayment = user.pro_started_at
        ? dayjs(user.pro_started_at)
            .add(1, frequency === "anual" ? "year" : "month")
            .format("DD/MM/YYYY")
        : "Pendiente";
    }
  }

  return (
    <div
      className={`rounded-xl border p-6 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
      }`}
    >
      <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2">
        Facturación
      </h3>
      <p
        className={`text-sm mb-6 ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Actualiza tu información de pago o cambia de planes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Card */}
        <div
          className={`rounded-lg border p-4 ${
            theme === "dark"
              ? "bg-gray-700/50 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-wider ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } mb-2`}
          >
            Plan Actual
          </p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold dark:text-white text-gray-900">
              {plan}
            </span>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                plan === "Profesional"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              {frequency}
            </span>
          </div>
          <p
            data-testid="plan-info"
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            } mb-4`}
          >
            {amount} {amountTime}{" "}
            <span
              className={`text-sm font-normal ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              (incl. IVA)
            </span>
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Gestionar planes
          </button>
        </div>

        {/* Billing Period Card */}
        <div
          className={`rounded-lg border p-4 ${
            theme === "dark"
              ? "bg-gray-700/50 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-wider ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } mb-2`}
          >
            Período de Facturación
          </p>
          <p
            data-testid="billing-period"
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            } mb-1`}
          >
            {frequency}
          </p>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } mb-4`}
          >
            {nextPayment}
          </p>
          {plan === "Profesional" && (
            <button
              onClick={() => navigate("/pricing")}
              className="w-full px-6 py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-lg transition-all duration-200"
            >
              Cambiar facturación
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
