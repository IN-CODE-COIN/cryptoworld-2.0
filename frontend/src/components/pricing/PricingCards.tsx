import { useState } from "react";
import { RiCheckLine } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth";
import type { UserType } from "../../context/AuthContext";
import { AuthModal } from "../auth/AuthModal";
import { PlanSelectorForm } from "./PlanSelectorForm";
import { Divider, message } from "antd";
import api from "../../lib/axios";

type Frequency = {
  value: "mensual" | "anual";
  label: string;
  priceSuffix: string;
};

const frequencies: Frequency[] = [
  { value: "mensual", label: "Mensual", priceSuffix: "/mes" },
  { value: "anual", label: "Anual", priceSuffix: "/año" },
];

type PlanPrice = {
  mensual: string;
  anual: string;
};

type Plan = {
  name: string;
  price: string | PlanPrice;
  description: string;
  features: string[];
  isRecommended: boolean;
  isEnterprise: boolean;
  buttonText: string;
  buttonLink?: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const plans: Plan[] = [
  {
    name: "Gratuito",
    price: "€0",
    description: "Uso personal limitado",
    features: [
      "Lista de seguimiento limitada",
      "Búsqueda de cryptos ilimitada",
      "Soporte por email",
    ],
    isRecommended: false,
    isEnterprise: false,
    buttonText: "Actualizar",
  },
  {
    name: "Profesional",
    price: { mensual: "€50", anual: "€490" },
    description: "Uso profesional",
    features: [
      "Lista de seguimiento ilimitada",
      "Búsqueda de cryptos ilimitada",
      "Soporte personalizado",
      "Acceso a gestión de cartera",
      "Rentabilidad en tiempo real de cartera",
    ],
    isRecommended: true,
    isEnterprise: false,
    buttonText: "Comenzar",
  },
  {
    name: "Empresa",
    price: "Personalizado",
    description: "Uso empresarial - Trabajo en equipo",
    features: ["Características personalizadas", "Diseños personalizados"],
    isRecommended: false,
    isEnterprise: true,
    buttonText: "Próximamente",
  },
];

export const PricingCards = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<Frequency>(frequencies[0]);
  const { isAuthenticated, user, login } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  //* Actualizo la información del usuario *//
  const refreshUserFromApi = async () => {
    if (!user) return;
    const { data } = await api.get(`/users/${user.id}`);
    login(localStorage.getItem("token") || "", data as UserType);
  };

  const activePlanName = isAuthenticated
    ? user?.rol === "normal"
      ? "Gratuito"
      : "Profesional"
    : "";

  const handleClick = (plan: Plan) => {
    if (plan.isEnterprise) return;
    setSelectedPlan(plan.name === "Gratuito" ? "normal" : "pro");
    if (!isAuthenticated) setAuthModalOpen(true);
    else setPaymentModalOpen(true);
  };

  const handleFrequencyChange = (freq: Frequency) => setFrequency(freq);

  const getCardClass = (
    isAuthenticated: boolean,
    isActivePlan: boolean,
    isRecommended: boolean
  ) => {
    let borderClass = "";
    if (isAuthenticated && isActivePlan) {
      borderClass = "border-2 border-indigo-600 dark:border-indigo-400";
    } else if (!isAuthenticated && isRecommended) {
      borderClass = "border-2 border-indigo-600 dark:border-indigo-400";
    } else {
      borderClass = "border border-gray-300 dark:border-gray-700";
    }

    return classNames(
      borderClass,
      "relative flex flex-col justify-between rounded-lg bg-white dark:bg-gray-800 p-4 shadow max-w-[300px] w-full"
    );
  };

  const getButtonClass = (isActive: boolean, isEnterprise: boolean) => {
    if (isEnterprise)
      return "mt-6 w-full rounded-md bg-gray-300 text-gray-500 cursor-not-allowed px-4 py-2 font-medium";
    if (isActive)
      return "mt-6 w-full rounded-md bg-green-500 border border-green-500 text-white px-4 py-2 font-medium";
    return "mt-6 w-full rounded-md bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2 font-medium";
  };

  const getButtonText = (plan: Plan, isActive: boolean) => {
    if (plan.isEnterprise) return plan.buttonText;
    if (isActive) return "Activo";
    return plan.buttonText;
  };

  const startTrial = async () => {
    await refreshUserFromApi();
    message.info("¡Prueba gratuita iniciada!");
    setPaymentModalOpen(false);
  };

  const subscribePlan = async () => {
    await refreshUserFromApi();
    message.success("¡Suscripción actualizada!");
    setPaymentModalOpen(false);
  };

  return (
    <section className="container mt-4 w-full mx-auto">
      <div className="flex flex-wrap justify-center md:justify-start items-stretch gap-4">
        {plans.map((plan, idx) => {
          const isActivePlan = plan.name === activePlanName;
          const priceToShow =
            plan.name === "Profesional" && typeof plan.price !== "string"
              ? plan.price[frequency.value]
              : (plan.price as string);

          return (
            <div
              key={idx}
              className={getCardClass(
                isAuthenticated,
                isActivePlan,
                plan.isRecommended
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                {plan.isRecommended && (
                  <span className="inline-flex items-center rounded-md border border-gray-300 bg-indigo-50 px-2 py-1 text-xs text-gray-800 dark:border-gray-600 dark:bg-indigo-600/10 dark:text-indigo-400 font-medium">
                    Recomendado
                  </span>
                )}
                {plan.isEnterprise && (
                  <span className="inline-flex items-center rounded-md border border-gray-300 bg-indigo-50 px-2 py-1 text-xs text-gray-800 dark:border-gray-600 dark:bg-indigo-600/10 dark:text-indigo-400 font-medium">
                    No disponible
                  </span>
                )}
              </div>
              <p className="mt-1 text-gray-600 dark:text-gray-300 text-left text-md">
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1 text-gray-900 dark:text-white font-semibold text-2xl">
                {priceToShow}
                {plan.name === "Profesional" && (
                  <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {frequency.priceSuffix}
                  </span>
                )}
              </p>
              {plan.name === "Profesional" ? (
                <div className="relative flex h-5 items-center justify-center mt-6 mb-4">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative z-10 grid grid-cols-2 gap-x-1 rounded-full bg-white dark:bg-gray-900 p-1 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-700 shadow">
                    {frequencies.map((f) => (
                      <label
                        key={f.value}
                        className={classNames(
                          f.value === frequency.value
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 dark:text-gray-300",
                          "cursor-pointer rounded-full px-3 py-1"
                        )}
                      >
                        <input
                          type="radio"
                          value={f.value}
                          checked={f.value === frequency.value}
                          onChange={() => handleFrequencyChange(f)}
                          className="sr-only"
                        />
                        {f.value}
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <Divider />
                </div>
              )}
              <div className="flex flex-col flex-grow justify-between mt-2">
                <div className="flex flex-col flex-grow">
                  <p className="font-medium text-gray-700 dark:text-gray-200 text-left">
                    Incluido:
                  </p>
                  <ul className="mt-2 space-y-2 text-gray-700 dark:text-gray-300 flex flex-col">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <RiCheckLine
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex-grow" />
                </div>
                <button
                  onClick={() => handleClick(plan)}
                  disabled={isActivePlan || plan.isEnterprise}
                  className={getButtonClass(isActivePlan, plan.isEnterprise)}
                >
                  {getButtonText(plan, isActivePlan)}
                </button>
              </div>
            </div>
          );
        })}

        {selectedPlan && (
          <PlanSelectorForm
            open={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            planName={selectedPlan}
            onStartTrial={startTrial}
            onSubscribe={subscribePlan}
          />
        )}
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    </section>
  );
};
