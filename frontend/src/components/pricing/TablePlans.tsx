import React, { Fragment, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { Button, Grid } from "antd";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Plan, Section } from "../../config/plansDictionary";
import { useAuth } from "../../hooks/useAuth";
import { AuthModal } from "../auth/AuthModal";

interface TablePlansProps {
  plans: Plan[];
  sections: Section[];
  billingFrequency: "mensual" | "anual";
}

const isVariablePrice = (
  price: string | { mensual: string; anual: string }
): price is { mensual: string; anual: string } => {
  return typeof price !== "string";
};

const { useBreakpoint } = Grid;

export const TablePlans: React.FC<TablePlansProps> = ({
  plans,
  sections,
  billingFrequency,
}) => {
  const screens = useBreakpoint();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const sizeText: string = screens.xs ? "text-xs" : "text-sm";
  const smallScreen: boolean | undefined =
    screens.xs || (screens.sm && !screens.md);

  return (
    <section className="mx-auto">
      <div className="md:mt-10">
        <div className="relative">
          <div
            className="sticky top-0 z-20 h-28 w-full"
            style={{ backgroundColor: theme === "dark" ? "#001529" : "#fff" }}
          />
          <table className="w-full tmd:table-fixed md:border-separate md:border-spacing-0 border-collapse text-left">
            <caption className="sr-only">
              Comparación de precios de los planes
            </caption>
            <colgroup>
              <col className="w-2/5" />
              {plans.map((_, index) => (
                <col key={index} className="w-1/5" />
              ))}
            </colgroup>
            <thead className="sticky top-28">
              <tr>
                <th
                  scope="col"
                  className="border-b border-gray-100 bg-white pb-8 dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="font-semibold lg:leading-7 text-gray-900 dark:text-gray-50">
                    Comparación de Precios
                  </div>
                  <div
                    className={`${sizeText} font-normal text-gray-600 dark:text-gray-400`}
                  >
                    Precio por mes (
                    {billingFrequency === "mensual" ? "mensual" : "anual"})
                  </div>
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className="border-b border-gray-100 bg-white px-2 pb-8 lg:px-8 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div
                      className={
                        !plan.isStarter
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-900 dark:text-gray-50"
                      }
                    >
                      <div className="font-semibold lg:leading-7">
                        {plan.name}
                      </div>
                      <div
                        className={`${sizeText} font-normal text-gray-600 dark:text-gray-400`}
                      >
                        {isVariablePrice(plan.price)
                          ? billingFrequency === "mensual"
                            ? plan.price.mensual
                            : plan.price.anual
                          : plan.price}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((section, sectionIdx) => (
                <Fragment key={section.name}>
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={plans.length + 1}
                      className={`${
                        sectionIdx === 0 ? "lg:pt-14 pt-10" : "lg:pt-10 pt-6"
                      } border-b border-gray-100 pb-4 text-base font-semibold lg:leading-6 text-gray-900 dark:border-gray-800 dark:text-gray-50`}
                    >
                      {section.name}
                    </th>
                  </tr>
                  {section.features.map((feature) => (
                    <tr
                      key={feature.name}
                      className="lg:transition hover:bg-indigo-50/30 dark:hover:bg-indigo-800/5"
                    >
                      <th
                        scope="row"
                        className={`${sizeText}flex items-center gap-2 border-b border-gray-100 py-4 font-normal lg:leading-6 text-gray-900 dark:border-gray-800 dark:text-gray-50`}
                      >
                        <span>{feature.name}</span>
                      </th>
                      {plans.map((plan) => (
                        <td
                          key={plan.name}
                          className="border-b border-gray-100 px-2 py-4 lg:px-8 dark:border-gray-800"
                        >
                          {typeof feature.plans[plan.name] === "string" ? (
                            <div
                              className={`${sizeText} leading-6 text-gray-600 dark:text-gray-400`}
                            >
                              {feature.plans[plan.name]}
                            </div>
                          ) : (
                            <>
                              {feature.plans[plan.name] === true ? (
                                <CheckCircleOutlined
                                  style={{ color: "#52c41a", fontSize: "1rem" }}
                                />
                              ) : (
                                <MinusCircleOutlined
                                  style={{ color: "#6a7282", fontSize: "1rem" }}
                                />
                              )}
                            </>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
              <tr>
                <th
                  scope="row"
                  className={`${sizeText} pt-6 font-normal lg:leading-6 text-gray-900 dark:text-gray-50`}
                >
                  <span className="sr-only">Link to activate plan</span>
                </th>
                {plans.map((plan) => {
                  const getPlanNameByRole = (role?: string): string => {
                    if (role === "normal") return "Gratuito";
                    if (role === "pro") return "Profesional";
                    return "";
                  };

                  const activePlanName = isAuthenticated
                    ? getPlanNameByRole(user?.rol)
                    : "";
                  const isActivePlan = plan.name === activePlanName;

                  let buttonLabel = plan.buttonText;
                  let buttonType: "default" | "primary" = "default";
                  let disabled = false;

                  if (!isAuthenticated) {
                    buttonType = "primary";
                  } else {
                    if (isActivePlan) {
                      buttonLabel = "Activo";
                      disabled = true;
                      buttonType = "primary";
                    } else if (plan.name === "Gratuito" && !isActivePlan) {
                      buttonLabel = "Cambiar";
                      buttonType = "primary";
                    } else if (
                      activePlanName === "Gratuito" &&
                      plan.name === "Profesional"
                    ) {
                      buttonLabel = "Mejorar plan";
                      buttonType = "primary";
                    } else {
                      buttonType = "primary";
                    }
                  }

                  const handleClick = (e: React.MouseEvent) => {
                    e.preventDefault();
                    if (!isAuthenticated) {
                      setModalOpen(true);
                    } else if (!isActivePlan) {
                      if (plan.name === "Empresa") navigate(plan.buttonLink);

                      const element = document.getElementById("pricing-cards");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  };

                  return (
                    <td key={plan.name} className="px-1 pt-6 lg:px-8">
                      <Button
                        type={buttonType}
                        className={sizeText}
                        size={smallScreen ? "small" : "middle"}
                        disabled={disabled}
                        onClick={handleClick}
                      >
                        {buttonLabel}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </section>
  );
};
