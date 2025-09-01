import React from "react";
import { Tabs, Divider } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import dayjs from "dayjs";

export const BillingPlan: React.FC = () => {
  const { user } = useAuth();

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
        "DD/MM/YYYY"
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
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Facturación
      </h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Actualiza tu información de pago o cambia de planes de acuerdo a tus
        necesidades.
      </p>
      <Tabs className="mt-6">
        <div className="mt-8 sm:mx-auto sm:max-w-7xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Plan
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p
                data-testid="plan-name"
                className="flex items-center space-x-2"
              >
                <span className="font-medium text-gray-900 dark:text-gray-400">
                  {plan}
                </span>
                <span
                  data-testid="plan-frequency"
                  className="inline-flex items-center self-center rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-500"
                >
                  {frequency}
                </span>
              </p>
              <p
                data-testid="plan-info"
                className="mt-2 font-semibold text-gray-900 dark:text-gray-400"
              >
                {amount} {amountTime}{" "}
                <span className="font-normal">(incl. IVA)</span>
              </p>
              <Link
                to="/pricing"
                className="mt-6 inline-flex rounded border border-gray-200 bg-white px-2.5 py-1.5 font-medium text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-900"
              >
                Gestionar planes
              </Link>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-400 mt-1">
                Periodo de Facturación
              </p>
              <p
                data-testid="billing-period"
                className="mt-2 font-semibold text-gray-900 dark:text-gray-400"
              >
                {frequency} <span className="font-normal">({nextPayment})</span>
              </p>
              {plan === "Profesional" && (
                <Link
                  to="/pricing"
                  className="mt-6 inline-flex rounded border border-gray-200 bg-white px-2.5 py-1.5 font-medium text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-900"
                >
                  Cambiar facturación
                </Link>
              )}
            </div>
          </div>
        </div>
      </Tabs>
      <Divider />
    </div>
  );
};
