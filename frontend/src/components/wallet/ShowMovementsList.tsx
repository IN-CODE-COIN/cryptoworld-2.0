import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Tag,
  Typography,
  Spin,
  message,
  Button,
  Space,
  Modal,
  Form,
  Input,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import api from "../../lib/axios";

const { Text } = Typography;

interface Movement {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: string;
}

export const ShowMovementsList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Movement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<Movement | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cartera/moves");
      setData(res.data);
    } catch {
      message.error("No se pudieron cargar los movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const handleEdit = (record: Movement) => {
    setEditingMovement(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (!editingMovement) return;

      const res = await api.put(`/cartera/moves/${editingMovement.id}`, values);
      message.success(res.data.message || "Movimiento actualizado");

      setIsModalOpen(false);
      setEditingMovement(null);
      fetchMovements();
    } catch (error: unknown) {
      let errMsg = "Error al actualizar el movimiento";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
      ) {
        errMsg = (error as { response: { data: { message: string } } }).response
          .data.message;
      }
      message.error(errMsg);
    }
  };

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (text: string) => (
        <Text>{new Date(text).toLocaleDateString()}</Text>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Cantidad",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <Text strong type={amount >= 0 ? "success" : "danger"}>
          {amount.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </Text>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (tipo: string) => (
        <Tag color={tipo === "deposito" ? "green" : "volcano"}>{tipo}</Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_value: unknown, record: Movement) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Editar movimiento"
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <section className="container md:w-5xl flex flex-col mx-auto">
      <div className="text-left max-w-xl mb-10">
        <Tag bordered color="blue" className="max-w-max font-semibold">
          <span className="uppercase"> Movimientos </span>
        </Tag>
        <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-gray-100 mb-2">
          Listado de todos los movimientos
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium text-wrap">
          Podrás controlar todos los movimientos registrados en tu cartera y
          editar las descripciones cuando lo necesites.
        </p>
      </div>
      {loading ? (
        <Spin
          tip="Cargando lista de movimientos..."
          fullscreen={true}
          size="large"
        />
      ) : (
        <div className="py-10 space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-2xl text-gray-800 flex items-center gap-4 dark:text-gray-100">
              Listado de movimientos
            </h2>
            <Button
              size="small"
              title="Volver a la cartera"
              onClick={() => navigate("/cartera")}
            >
              Volver
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </div>
      )}

      {/* Modal para editar */}
      <Modal
        title="Editar Movimiento"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="description"
            label="Descripción"
            rules={[
              { required: true, message: "La descripción es obligatoria" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};
