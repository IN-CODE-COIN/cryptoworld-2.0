import { useState } from "react";
import { Modal, Form, Select, Radio, Button, message, DatePicker } from "antd";
import type { RadioChangeEvent } from "antd";
import dayjs from "dayjs";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

const { Option } = Select;

type PlanSelectorFormProps = {
  open: boolean;
  onClose: () => void;
  planName: string;
  onStartTrial?: () => void;
  onSubscribe?: () => void;
};

export const PlanSelectorForm = ({
  open,
  onClose,
  planName,
  onStartTrial,
  onSubscribe,
}: PlanSelectorFormProps) => {
  const [trial, setTrial] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const handleSubmit = async (values: {
    plan: "normal" | "pro";
    trial?: boolean;
    frequency?: "mensual" | "anual";
  }) => {
    try {
      if (values.trial) {
        await api.post("/start-trial");
        message.success("Trial activado");
        onStartTrial?.();
      } else {
        await api.post("/change-plan", {
          rol: values.plan,
          frequency: values.plan === "pro" ? values.frequency : null,
        });
        message.success(`Plan actualizado correctamente a ${values.plan}`);
        onSubscribe?.();
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message.error(
          axiosErr.response?.data?.message || "Error al actualizar el plan"
        );
      } else {
        message.error("Error al actualizar el plan");
      }
    }
  };

  const getTrialEndDate = () => dayjs().add(7, "day");

  return (
    <Modal
      title="Selecciona tu plan"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ plan: planName || "normal", trial: false }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Plan"
          name="plan"
          rules={[{ required: true, message: "Debes elegir un plan" }]}
        >
          <Select placeholder="Elige un plan">
            <Option value="normal">Gratuito</Option>
            <Option value="pro">Profesional</Option>
            <Option value="empresa" disabled={true}>
              Empresa
            </Option>
          </Select>
        </Form.Item>

        <Form.Item shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue("plan") === "pro" && (
              <Form.Item
                label="Frecuencia de pago"
                name="frequency"
                rules={[
                  { required: true, message: "Selecciona mensual o anual" },
                ]}
              >
                <Radio.Group>
                  <Radio value="mensual">Mensual (€50/mes)</Radio>
                  <Radio value="anual">Anual (€490/año)</Radio>
                </Radio.Group>
              </Form.Item>
            )
          }
        </Form.Item>

        <Form.Item label="Periodo de prueba" name="trial">
          {user?.has_used_trial ? (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
              Ya has utilizado tú periodo de prueba gratuito.
            </div>
          ) : (
            <Radio.Group
              onChange={(e: RadioChangeEvent) => setTrial(e.target.value)}
            >
              <Radio value={true}>Activar prueba gratis</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          )}
        </Form.Item>

        {trial && (
          <Form.Item label="Tu periodo de prueba caduca el:">
            <DatePicker value={getTrialEndDate()} disabled />
            <p className="text-gray-500 text-sm">
              Tu prueba gratuita terminará el{" "}
              {getTrialEndDate().format("DD/MM/YYYY")}
            </p>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Guardar plan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
