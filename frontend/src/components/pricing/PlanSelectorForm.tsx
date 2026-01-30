import { useState } from "react";
import {
  Modal,
  Form,
  Select,
  Radio,
  Button,
  message,
  DatePicker,
  Spin,
} from "antd";
import { CheckCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import dayjs from "dayjs";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

const { Option } = Select;

type PlanSelectorFormProps = {
  open: boolean;
  onClose: () => void;
  planName: string;
  onStartTrial?: () => void;
  onSubscribe?: () => void;
};

const planDescriptions: Record<string, string> = {
  normal: "Plan gratuito con funcionalidades básicas",
  pro: "Acceso completo a todas las funcionalidades premium",
};

const planColors: Record<
  string,
  { gradient: string; bg: string; border: string }
> = {
  normal: {
    gradient: "from-blue-600 to-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-700",
  },
  pro: {
    gradient: "from-emerald-600 to-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-700",
  },
};

export const PlanSelectorForm = ({
  open,
  onClose,
  planName,
  onStartTrial,
  onSubscribe,
}: PlanSelectorFormProps) => {
  const [trial, setTrial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (values: {
    plan: "normal" | "pro";
    trial?: boolean;
    frequency?: "mensual" | "anual";
  }) => {
    setLoading(true);
    try {
      if (values.trial) {
        await api.post("/start-trial");
        message.success("Trial activado correctamente");
        onStartTrial?.();
      } else {
        await api.post("/change-plan", {
          rol: values.plan,
          frequency: values.plan === "pro" ? values.frequency : null,
        });
        message.success(
          `Plan actualizado a ${values.plan === "pro" ? "Profesional" : "Gratuito"}`,
        );
        onSubscribe?.();
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message.error(
          axiosErr.response?.data?.message || "Error al actualizar el plan",
        );
      } else {
        message.error("Error al actualizar el plan");
      }
    } finally {
      setLoading(false);
    }
  };

  const getTrialEndDate = () => dayjs().add(7, "day");
  const planColor = planColors[planName] || planColors.normal;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      styles={{
        content: {
          padding: 0,
          borderRadius: "12px",
        },
      }}
      maskClosable={false}
    >
      <Spin spinning={loading} tip="Procesando..." size="large">
        <div
          className={`rounded-xl overflow-hidden ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-8 border-b ${
              theme === "dark"
                ? `bg-linear-to-r ${planColor.gradient} bg-opacity-10 border-gray-700`
                : `bg-linear-to-r ${planColor.gradient} bg-opacity-5 border-gray-200`
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Selecciona tu plan
            </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Elige el plan que se adapte a tus necesidades
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <Form
              form={form}
              layout="vertical"
              initialValues={{ plan: planName || "normal", trial: false }}
              onFinish={handleSubmit}
            >
              {/* Plan Selection */}
              <Form.Item
                label={<span className="font-medium">Plan</span>}
                name="plan"
                rules={[{ required: true, message: "Debes elegir un plan" }]}
              >
                <Select
                  placeholder="Elige un plan"
                  className="rounded-lg"
                  size="large"
                >
                  <Option value="normal">
                    <div className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-blue-600" />
                      <span>Gratuito</span>
                    </div>
                  </Option>
                  <Option value="pro">
                    <div className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-emerald-600" />
                      <span>Profesional</span>
                    </div>
                  </Option>
                  <Option value="empresa" disabled>
                    <span>Empresa (Próximamente)</span>
                  </Option>
                </Select>
              </Form.Item>

              {/* Frequency Selection for Pro Plan */}
              <Form.Item shouldUpdate>
                {({ getFieldValue }) =>
                  getFieldValue("plan") === "pro" && (
                    <Form.Item
                      label={
                        <span className="font-medium">Frecuencia de pago</span>
                      }
                      name="frequency"
                      rules={[
                        {
                          required: true,
                          message: "Selecciona mensual o anual",
                        },
                      ]}
                    >
                      <Radio.Group className="space-y-3">
                        <div
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            form.getFieldValue("frequency") === "mensual"
                              ? theme === "dark"
                                ? "border-emerald-600 bg-emerald-900/20"
                                : "border-emerald-600 bg-emerald-50"
                              : theme === "dark"
                                ? "border-gray-700 bg-gray-700/30"
                                : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <Radio value="mensual" className="w-full">
                            <div className="ml-2">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                Pago Mensual
                              </p>
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                €50 / mes
                              </p>
                            </div>
                          </Radio>
                        </div>
                        <div
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            form.getFieldValue("frequency") === "anual"
                              ? theme === "dark"
                                ? "border-emerald-600 bg-emerald-900/20"
                                : "border-emerald-600 bg-emerald-50"
                              : theme === "dark"
                                ? "border-gray-700 bg-gray-700/30"
                                : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <Radio value="anual" className="w-full">
                            <div className="ml-2">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  Pago Anual
                                </p>
                                <span className="text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">
                                  Ahorra 17%
                                </span>
                              </div>
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                €490 / año
                              </p>
                            </div>
                          </Radio>
                        </div>
                      </Radio.Group>
                    </Form.Item>
                  )
                }
              </Form.Item>

              {/* Trial Period */}
              <Form.Item
                label={<span className="font-medium">Período de prueba</span>}
                name="trial"
              >
                {user?.has_used_trial ? (
                  <div
                    className={`p-4 rounded-lg border-2 border-dashed ${
                      theme === "dark"
                        ? "bg-yellow-900/20 border-yellow-700"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-700"
                      }`}
                    >
                      ✓ Ya has utilizado tu período de prueba gratuito
                    </p>
                  </div>
                ) : (
                  <Radio.Group
                    onChange={(e: RadioChangeEvent) => setTrial(e.target.value)}
                    className="space-y-3"
                  >
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        trial
                          ? theme === "dark"
                            ? "border-emerald-600 bg-emerald-900/20"
                            : "border-emerald-600 bg-emerald-50"
                          : theme === "dark"
                            ? "border-gray-700 bg-gray-700/30"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <Radio value={true} className="w-full">
                        <div className="ml-2">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Activar prueba gratuita
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            7 días de acceso completo
                          </p>
                        </div>
                      </Radio>
                    </div>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        !trial
                          ? theme === "dark"
                            ? "border-blue-600 bg-blue-900/20"
                            : "border-blue-600 bg-blue-50"
                          : theme === "dark"
                            ? "border-gray-700 bg-gray-700/30"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <Radio value={false} className="w-full">
                        <div className="ml-2">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Sin período de prueba
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Ir directamente al plan
                          </p>
                        </div>
                      </Radio>
                    </div>
                  </Radio.Group>
                )}
              </Form.Item>

              {/* Trial End Date */}
              {trial && !user?.has_used_trial && (
                <Form.Item>
                  <div
                    className={`p-4 rounded-lg border-2 border-dashed ${
                      theme === "dark"
                        ? "bg-blue-900/20 border-blue-700"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarOutlined className="text-blue-600 dark:text-blue-400" />
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        Período de prueba
                      </p>
                    </div>
                    <DatePicker
                      value={getTrialEndDate()}
                      disabled
                      className="w-full"
                      size="large"
                    />
                    <p
                      className={`text-xs mt-2 ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      Tu prueba gratuita terminará el{" "}
                      <span className="font-semibold">
                        {getTrialEndDate().format("DD/MM/YYYY")}
                      </span>
                    </p>
                  </div>
                </Form.Item>
              )}

              {/* Submit Button */}
              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full bg-linear-to-r from-blue-600 to-blue-500"
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Guardar plan"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};
