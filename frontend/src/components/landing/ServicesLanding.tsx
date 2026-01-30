import { useTheme } from "../../hooks/useTheme";
import {
  LineChartOutlined,
  FolderOutlined,
  BarChartOutlined,
  StarOutlined,
  BellOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

export const ServicesLanding = () => {
  const { theme } = useTheme();

  const services = [
    {
      icon: (
        <LineChartOutlined className="text-2xl text-gray-600 dark:text-gray-400" />
      ),
      title: "Monitoreo en Tiempo Real",
      description:
        "Sigue el precio y desempeño de tus criptomonedas favoritas con actualizaciones en tiempo real.",
    },
    {
      icon: (
        <FolderOutlined className="text-2xl text-gray-600 dark:text-gray-400" />
      ),
      title: "Gestión de Cartera",
      description:
        "Organiza y administra tus inversiones cripto en un dashboard intuitivo y fácil de usar.",
    },
    {
      icon: (
        <BarChartOutlined className="text-2xl text-gray-600 dark:text-gray-400" />
      ),
      title: "Gráficos Detallados de Cartera",
      description:
        "Visualiza el rendimiento de tu portafolio con gráficos avanzados. (En desarrollo)",
    },
    {
      icon: (
        <StarOutlined className="text-2xl text-gray-600 dark:text-gray-400" />
      ),
      title: "Watchlist Personalizada",
      description:
        "Crea tu propia lista de seguimiento con las criptomonedas que más te interesen.",
    },
    {
      icon: (
        <BellOutlined className="text-2xl text-gray-600 dark:text-gray-400" />
      ),
      title: "Alertas Personalizadas",
      description:
        "Recibe notificaciones cuando los precios alcanzan los niveles que defines. (En desarrollo)",
    },
    {
      icon: (
        <SafetyOutlined className="text-2xl text-gray-600 dark:text-gray-400" />
      ),
      title: "Plan Gratuito Completo",
      description:
        "Acceso a todas las características básicas sin pagar. Actualiza cuando necesites más.",
    },
  ];

  return (
    <section
      id="services"
      className={`py-20 ${
        theme === "dark"
          ? "bg-gray-900 border-t border-gray-800"
          : "bg-gray-50 border-t border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400"
          >
            Herramientas Intuitivas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Monitorea tus inversiones cripto con una plataforma simple y potente
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className={`p-8 rounded-xl border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                  : "bg-white border-gray-200 hover:border-blue-500"
              }`}
            >
              <div className="mb-4">{service.icon}</div>
              <h3
                className={`text-xl font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
