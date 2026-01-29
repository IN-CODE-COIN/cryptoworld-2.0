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
    buttonText: "Comenzar",
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

  const handleScrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    if (plan.isEnterprise) {
      handleScrollToContact();
      return;
    }
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
      return "mt-6 w-full rounded-md bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg px-4 py-2 font-medium transition-all";
    if (isActive)
      return "mt-6 w-full rounded-md bg-green-500 border border-green-500 text-white px-4 py-2 font-medium";
    return "mt-6 w-full rounded-md bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg px-4 py-2 font-medium transition-all";
  };

  const getButtonText = (plan: Plan, isActive: boolean) => {
    if (plan.isEnterprise) return "Contactar";
    if (isActive) return "Activo";
    if (isAuthenticated && !isActive && plan.name === "Gratuito")
      return "Cambiar";
    if (isAuthenticated && !isActive && plan.name === "Profesional")
      return "Mejorar";
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
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Planes de Precios
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Elige el plan perfecto para ti y comienza a gestionar tu portafolio cripto
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-stretch gap-6">
        {plans.map((plan, idx) => {
          const isActivePlan = plan.name === activePlanName;
          const priceToShow =
            plan.name === "Profesional" && typeof plan.price !== "string"
              ? plan.price[frequency.value]
              : (plan.price as string);

          return (
            <div
              id="pricing-cards"
              key={idx}
              className={`relative flex flex-col justify-between rounded-xl backdrop-blur-sm p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 max-w-[350px] w-full ${
                isAuthenticated && isActivePlan
                  ? "border-2 border-blue-600 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-800 shadow-lg"
                  : !isAuthenticated && plan.isRecommended
                  ? "border-2 border-blue-600 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-800 shadow-lg"
                  : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}
            >
              {plan.isRecommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 dark:border-blue-600 bg-blue-100 dark:bg-blue-900/40 px-4 py-1.5 text-xs text-blue-800 dark:text-blue-200 font-semibold">
                    ★ Recomendado
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
              </div>
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
                  disabled={isActivePlan && !plan.isRecommended && !plan.isEnterprise}
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
